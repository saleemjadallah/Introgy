import UIKit
import SwiftUI

// MARK: - UIKit Implementation
class AnimatedProgressView: UIView {
    // UI Elements
    private let backgroundBar = UIView()
    private let progressBar = UIView()
    private let progressLabel = UILabel()
    
    // Properties
    private var progress: CGFloat = 0 {
        didSet {
            updateProgressBar(animated: true)
        }
    }
    
    private var progressColor: UIColor = DesignSystem.Colors.accent {
        didSet {
            progressBar.backgroundColor = progressColor
        }
    }
    
    private var showLabel: Bool = true {
        didSet {
            progressLabel.isHidden = !showLabel
        }
    }
    
    // MARK: - Initialization
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupViews()
    }
    
    // MARK: - Setup
    private func setupViews() {
        // Background bar setup
        backgroundBar.translatesAutoresizingMaskIntoConstraints = false
        backgroundBar.backgroundColor = DesignSystem.Colors.cardBackground
        backgroundBar.layer.cornerRadius = 6
        addSubview(backgroundBar)
        
        // Progress bar setup
        progressBar.translatesAutoresizingMaskIntoConstraints = false
        progressBar.backgroundColor = progressColor
        progressBar.layer.cornerRadius = 6
        backgroundBar.addSubview(progressBar)
        
        // Progress label setup
        progressLabel.translatesAutoresizingMaskIntoConstraints = false
        progressLabel.font = DesignSystem.Typography.font(size: DesignSystem.Typography.caption1, weight: .medium)
        progressLabel.textColor = DesignSystem.Colors.primaryText
        progressLabel.textAlignment = .center
        progressLabel.isHidden = !showLabel
        addSubview(progressLabel)
        
        // Setup constraints
        NSLayoutConstraint.activate([
            backgroundBar.topAnchor.constraint(equalTo: topAnchor),
            backgroundBar.leadingAnchor.constraint(equalTo: leadingAnchor),
            backgroundBar.trailingAnchor.constraint(equalTo: trailingAnchor),
            backgroundBar.heightAnchor.constraint(equalToConstant: 12),
            
            progressBar.topAnchor.constraint(equalTo: backgroundBar.topAnchor),
            progressBar.leadingAnchor.constraint(equalTo: backgroundBar.leadingAnchor),
            progressBar.bottomAnchor.constraint(equalTo: backgroundBar.bottomAnchor),
            
            progressLabel.topAnchor.constraint(equalTo: backgroundBar.bottomAnchor, constant: 4),
            progressLabel.centerXAnchor.constraint(equalTo: centerXAnchor),
            progressLabel.bottomAnchor.constraint(equalTo: bottomAnchor)
        ])
        
        // Initial update
        updateProgressBar(animated: false)
    }
    
    // MARK: - Public Methods
    func setProgress(_ progress: CGFloat, animated: Bool = true) {
        let clampedProgress = min(max(progress, 0.0), 1.0)
        
        if animated {
            UIView.animate(withDuration: 0.5, delay: 0, 
                          usingSpringWithDamping: 0.7, 
                          initialSpringVelocity: 0.5, 
                          options: .curveEaseInOut, 
                          animations: {
                self.progress = clampedProgress
            })
        } else {
            self.progress = clampedProgress
        }
    }
    
    func setProgressColor(_ color: UIColor) {
        self.progressColor = color
    }
    
    func setShowLabel(_ show: Bool) {
        self.showLabel = show
    }
    
    // MARK: - Private Methods
    private func updateProgressBar(animated: Bool) {
        // Update progress bar width
        let progressWidth = backgroundBar.bounds.width * progress
        
        if animated {
            UIView.animate(withDuration: 0.5, delay: 0, 
                          usingSpringWithDamping: 0.7, 
                          initialSpringVelocity: 0.5, 
                          options: .curveEaseInOut, 
                          animations: {
                self.progressBar.frame.size.width = progressWidth
            })
        } else {
            progressBar.frame.size.width = progressWidth
        }
        
        // Update label
        progressLabel.text = "\(Int(progress * 100))%"
        
        // Update color based on progress
        let newColor = DesignSystem.Colors.batteryColor(for: Double(progress))
        if newColor != progressColor {
            if animated {
                UIView.animate(withDuration: 0.3) {
                    self.progressBar.backgroundColor = newColor
                }
            } else {
                progressBar.backgroundColor = newColor
            }
            progressColor = newColor
        }
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        updateProgressBar(animated: false)
    }
}

// MARK: - SwiftUI Implementation
struct AnimatedProgressViewRepresentable: UIViewRepresentable {
    @Binding var progress: Double
    var showLabel: Bool = true
    var color: Color?
    
    func makeUIView(context: Context) -> AnimatedProgressView {
        let progressView = AnimatedProgressView()
        progressView.setShowLabel(showLabel)
        return progressView
    }
    
    func updateUIView(_ uiView: AnimatedProgressView, context: Context) {
        uiView.setProgress(CGFloat(progress))
        
        if let color = color {
            uiView.setProgressColor(UIColor(color))
        }
    }
}

struct AnimatedProgressBarView: View {
    @Binding var progress: Double
    var color: Color?
    var showLabel: Bool = true
    var height: CGFloat = 12
    
    @State private var animatedProgress: Double = 0
    @State private var isAnimating: Bool = false
    
    var progressColor: Color {
        color ?? DesignSystem.Colors.SwiftUI.batteryColor(for: progress)
    }
    
    var body: some View {
        VStack(spacing: 4) {
            // Progress Bar
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    // Background
                    RoundedRectangle(cornerRadius: height / 2)
                        .fill(DesignSystem.Colors.SwiftUI.cardBackground)
                        .frame(height: height)
                    
                    // Progress
                    RoundedRectangle(cornerRadius: height / 2)
                        .fill(progressColor)
                        .frame(width: max(geometry.size.width * animatedProgress, height), height: height)
                        .overlay(
                            // Shine effect
                            RoundedRectangle(cornerRadius: height / 2)
                                .fill(
                                    LinearGradient(
                                        gradient: Gradient(colors: [
                                            Color.white.opacity(0.3),
                                            Color.white.opacity(0)
                                        ]),
                                        startPoint: .top,
                                        endPoint: .bottom
                                    )
                                )
                                .frame(height: height / 2)
                                .offset(y: -height / 4)
                                .mask(
                                    RoundedRectangle(cornerRadius: height / 2)
                                        .frame(width: max(geometry.size.width * animatedProgress, height), height: height)
                                )
                        )
                        .overlay(
                            // Pulse animation when progress changes
                            RoundedRectangle(cornerRadius: height / 2)
                                .stroke(progressColor, lineWidth: isAnimating ? 3 : 0)
                                .frame(width: max(geometry.size.width * animatedProgress, height), height: height)
                                .opacity(isAnimating ? 0 : 0.5)
                                .animation(
                                    isAnimating ?
                                        Animation.easeOut(duration: 0.8).repeatCount(1, autoreverses: false) :
                                        .default,
                                    value: isAnimating
                                )
                        )
                }
            }
            .frame(height: height)
            
            // Label
            if showLabel {
                Text("\(Int(progress * 100))%")
                    .font(DesignSystem.Typography.SwiftUI.caption1(weight: .medium))
                    .foregroundColor(DesignSystem.Colors.SwiftUI.primaryText)
            }
        }
        .onAppear {
            withAnimation(.spring(response: 0.5, dampingFraction: 0.7)) {
                animatedProgress = progress
            }
        }
        .onChange(of: progress) { oldValue, newValue in
            withAnimation(.spring(response: 0.5, dampingFraction: 0.7)) {
                animatedProgress = newValue
            }
            
            // Trigger pulse animation
            isAnimating = true
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
                isAnimating = false
            }
        }
    }
}

// MARK: - Circular Progress View
class CircularProgressView: UIView {
    // UI Elements
    private let backgroundLayer = CAShapeLayer()
    private let progressLayer = CAShapeLayer()
    private let percentageLabel = UILabel()
    
    // Properties
    private var progress: CGFloat = 0 {
        didSet {
            updateProgressLayer(animated: true)
        }
    }
    
    private var progressColor: UIColor = DesignSystem.Colors.accent {
        didSet {
            progressLayer.strokeColor = progressColor.cgColor
        }
    }
    
    private var lineWidth: CGFloat = 10
    
    // MARK: - Initialization
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupViews()
    }
    
    // MARK: - Setup
    private func setupViews() {
        // Background layer setup
        backgroundLayer.fillColor = UIColor.clear.cgColor
        backgroundLayer.strokeColor = DesignSystem.Colors.cardBackground.cgColor
        backgroundLayer.lineWidth = lineWidth
        backgroundLayer.lineCap = .round
        layer.addSublayer(backgroundLayer)
        
        // Progress layer setup
        progressLayer.fillColor = UIColor.clear.cgColor
        progressLayer.strokeColor = progressColor.cgColor
        progressLayer.lineWidth = lineWidth
        progressLayer.lineCap = .round
        progressLayer.strokeEnd = 0
        layer.addSublayer(progressLayer)
        
        // Percentage label setup
        percentageLabel.translatesAutoresizingMaskIntoConstraints = false
        percentageLabel.font = DesignSystem.Typography.font(size: DesignSystem.Typography.title3, weight: .bold)
        percentageLabel.textColor = DesignSystem.Colors.primaryText
        percentageLabel.textAlignment = .center
        addSubview(percentageLabel)
        
        // Setup constraints
        NSLayoutConstraint.activate([
            percentageLabel.centerXAnchor.constraint(equalTo: centerXAnchor),
            percentageLabel.centerYAnchor.constraint(equalTo: centerYAnchor)
        ])
        
        // Initial update
        updateProgressLayer(animated: false)
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        
        // Update circular paths
        let center = CGPoint(x: bounds.midX, y: bounds.midY)
        let radius = min(bounds.width, bounds.height) / 2 - lineWidth / 2
        
        let startAngle = -CGFloat.pi / 2
        let endAngle = startAngle + 2 * CGFloat.pi
        
        let circularPath = UIBezierPath(arcCenter: center,
                                       radius: radius,
                                       startAngle: startAngle,
                                       endAngle: endAngle,
                                       clockwise: true)
        
        backgroundLayer.path = circularPath.cgPath
        progressLayer.path = circularPath.cgPath
        
        // Update progress
        updateProgressLayer(animated: false)
    }
    
    // MARK: - Public Methods
    func setProgress(_ progress: CGFloat, animated: Bool = true) {
        let clampedProgress = min(max(progress, 0.0), 1.0)
        
        if animated {
            self.progress = clampedProgress
        } else {
            CATransaction.begin()
            CATransaction.setDisableActions(true)
            self.progress = clampedProgress
            CATransaction.commit()
        }
    }
    
    func setProgressColor(_ color: UIColor) {
        self.progressColor = color
    }
    
    func setLineWidth(_ width: CGFloat) {
        self.lineWidth = width
        backgroundLayer.lineWidth = width
        progressLayer.lineWidth = width
        setNeedsLayout()
    }
    
    // MARK: - Private Methods
    private func updateProgressLayer(animated: Bool) {
        // Update progress layer stroke end
        if animated {
            let animation = CABasicAnimation(keyPath: "strokeEnd")
            animation.fromValue = progressLayer.strokeEnd
            animation.toValue = progress
            animation.duration = 0.5
            animation.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
            progressLayer.strokeEnd = progress
            progressLayer.add(animation, forKey: "progressAnimation")
        } else {
            progressLayer.strokeEnd = progress
        }
        
        // Update label
        percentageLabel.text = "\(Int(progress * 100))%"
        
        // Update color based on progress
        let newColor = DesignSystem.Colors.batteryColor(for: Double(progress))
        if newColor != progressColor {
            if animated {
                let colorAnimation = CABasicAnimation(keyPath: "strokeColor")
                colorAnimation.fromValue = progressLayer.strokeColor
                colorAnimation.toValue = newColor.cgColor
                colorAnimation.duration = 0.3
                colorAnimation.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
                progressLayer.strokeColor = newColor.cgColor
                progressLayer.add(colorAnimation, forKey: "colorAnimation")
            } else {
                progressLayer.strokeColor = newColor.cgColor
            }
            progressColor = newColor
        }
    }
}

// MARK: - SwiftUI Circular Progress View
struct CircularProgressViewRepresentable: UIViewRepresentable {
    @Binding var progress: Double
    var lineWidth: CGFloat = 10
    var color: Color?
    
    func makeUIView(context: Context) -> CircularProgressView {
        let progressView = CircularProgressView()
        progressView.setLineWidth(lineWidth)
        return progressView
    }
    
    func updateUIView(_ uiView: CircularProgressView, context: Context) {
        uiView.setProgress(CGFloat(progress))
        
        if let color = color {
            uiView.setProgressColor(UIColor(color))
        }
    }
}

struct CircularProgressBarView: View {
    @Binding var progress: Double
    var color: Color?
    var lineWidth: CGFloat = 10
    
    @State private var animatedProgress: Double = 0
    @State private var isAnimating: Bool = false
    
    var progressColor: Color {
        color ?? DesignSystem.Colors.SwiftUI.batteryColor(for: progress)
    }
    
    var body: some View {
        ZStack {
            // Background Circle
            Circle()
                .stroke(
                    DesignSystem.Colors.SwiftUI.cardBackground,
                    lineWidth: lineWidth
                )
            
            // Progress Circle
            Circle()
                .trim(from: 0, to: CGFloat(animatedProgress))
                .stroke(
                    progressColor,
                    style: StrokeStyle(
                        lineWidth: lineWidth,
                        lineCap: .round
                    )
                )
                .rotationEffect(.degrees(-90))
                .overlay(
                    // Shine effect
                    Circle()
                        .trim(from: 0, to: CGFloat(animatedProgress))
                        .stroke(
                            LinearGradient(
                                gradient: Gradient(colors: [
                                    Color.white.opacity(0.3),
                                    Color.white.opacity(0)
                                ]),
                                startPoint: .top,
                                endPoint: .bottom
                            ),
                            style: StrokeStyle(
                                lineWidth: lineWidth / 2,
                                lineCap: .round
                            )
                        )
                        .rotationEffect(.degrees(-90))
                        .blendMode(.screen)
                )
            
            // Percentage Text
            Text("\(Int(progress * 100))%")
                .font(DesignSystem.Typography.SwiftUI.title3(weight: .bold))
                .foregroundColor(DesignSystem.Colors.SwiftUI.primaryText)
            
            // Pulse animation when progress changes
            if isAnimating {
                Circle()
                    .stroke(
                        progressColor.opacity(0.5),
                        lineWidth: 3
                    )
                    .scaleEffect(1.1)
                    .opacity(0)
                    .animation(
                        Animation.easeOut(duration: 0.8),
                        value: isAnimating
                    )
            }
        }
        .onAppear {
            withAnimation(.spring(response: 0.5, dampingFraction: 0.7)) {
                animatedProgress = progress
            }
        }
        .onChange(of: progress) { oldValue, newValue in
            withAnimation(.spring(response: 0.5, dampingFraction: 0.7)) {
                animatedProgress = newValue
            }
            
            // Trigger pulse animation
            isAnimating = true
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
                isAnimating = false
            }
        }
    }
}

// MARK: - Preview
#if DEBUG
struct AnimatedProgressView_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 40) {
            AnimatedProgressBarView(progress: .constant(0.75))
                .frame(height: 20)
            
            CircularProgressBarView(progress: .constant(0.75))
                .frame(width: 150, height: 150)
        }
        .padding()
        .background(Color.black)
        .previewLayout(.sizeThatFits)
    }
}
#endif
